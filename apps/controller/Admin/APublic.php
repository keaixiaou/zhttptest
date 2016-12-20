<?php
/**
 * Created by PhpStorm.
 * User: zhaoye
 * Date: 2016/12/19
 * Time: 下午8:40
 */

namespace controller\Admin;

use org\RBAC;
use org\Image;
use org\Str;
use ZPHP\Core\App;
use ZPHP\Core\Db;
use ZPHP\Core\Log;

class APublic extends Admin{
    /**
     * 登录页面
     */
    public function login(){
        if($this->input->session[config('admin','USER_AUTH_KEY')]){
           return $this->redirect(url('admin/index/index'));
        }else{
            $this->display();
        }
    }

    /**
     * 验证码图片
     */
    public function verify(){
        $type = isset($this->input->get['type'])?$this->input->get['type']:'gif';
        $length = 4;
        $mode = 1;
        $randStr = Str::randString($length,$mode);
        $this->input->session['verify'] = md5($randStr);
        $image = Image::buildImageVerify(4,1,$type,50,27,$randStr);
        $this->image($image, $type);
    }

    /**
     * 登录校验
     */
    public function checkLogin(){
        //
        if(empty($this->input->post['account'])) {
            return $this->adminReturn(null, '帐号必须！', false);
        }
        elseif (empty($this->input->post['password'])){
            return $this->adminReturn(null, '密码必须！', false);
        }
        elseif (empty($this->input->post['verify'])){
            return $this->adminReturn(null, '验证码必须！', false);
        }
        //生成认证条件
        $map = array();
        // 支持使用绑定帐号登录
        $map['account']	= $this->input->post['account'];
        $map['pwd'] = $this->input->post['password'];
        $map["status"] = array('gt',0);
        if ( $this->input->session['verify'] != md5($this->input->post['verify']) ) {
            return $this->adminReturn(null, '验证码错误！', false);
        }
        $authInfo = yield RBAC::authenticate($map);
        //使用用户名、密码和状态的方式进行认证
        if ( empty($authInfo) ) {
           return $this->adminReturn(null, '帐号不存在或已禁用！', false);
        }
        else {
            if($authInfo['password'] != md5($this->input->post['password'])) {
                return  $this->adminReturn(null, '密码错误！', false);
            }
            $this->input->session[config('admin','USER_AUTH_KEY')]	=	$authInfo['id'];
            $this->input->session['email']  =	$authInfo['email'];
            $this->input->session[config('admin','DB_PREFIX')]['nickname'] = $authInfo['nickname'];
            $this->input->session[config('admin','DB_PREFIX')]['bg_listRows'] =
                yield App::model("AdminVariable")->getFieldByMykey('bg_list_rows', 'myvalue');
            $admin_role_user = yield Db::table("admin_role_user")->where('user_id='.$authInfo['id'])->find();
            $this->input->session[config('admin','DB_PREFIX')]['role'] = $admin_role_user['role_id'];

            if($authInfo['id']==1) {
                $this->input->session[config('admin','ADMIN_AUTH_KEY')] = true;
            }
            //保存登录信息
            $ip = $this->input->server['remote_addr'];
            $time =	time();
            $data = array();
            $data['last_login_time'] = $time;
            $data['login_count'] = array('exp','login_count+1');
            $data['last_login_ip'] = $ip;
            $res = yield Db::table('admin_user')->where(['id'=>$authInfo['id']])->save($data);
            // 缓存访问权限
            $authId = $this->input->session[config('admin','USER_AUTH_KEY')];
            // 如果使用普通权限模式，保存当前用户的访问权限列表
            // 对管理员开发所有权限
            if(config('admin','USER_AUTH_TYPE') !=2 && !isset($this->input->session[config('admin','ADMIN_AUTH_KEY')]) )
                $this->input->session[config('admin','ADMIN_AUTH_KEY')]['_ACCESS_LIST']	=	yield RBAC::getAccessList($authId);
            return $this->adminReturn(null, '登录成功！', true);
        }
    }




    // 用户登出
    public function logout() {
        if ( isset($this->input->session[config('admin','USER_AUTH_KEY')]) ) {
            unset($this->input->session[config('admin','DB_PREFIX')]['menu'.$this->input->session[config('admin','USER_AUTH_KEY')]]);
            unset($this->input->session[config('admin','USER_AUTH_KEY')]);
            unset($this->input->session[config('admin','ADMIN_AUTH_KEY')]);
            unset($this->input->session[config('admin','DB_PREFIX')]['nickname']);
            unset($this->input->session[config('admin','DB_PREFIX')]['role']);
            unset($this->input->session[config('admin','DB_PREFIX')]['_ACCESS_LIST']);
            unset($this->input->session[config('admin','DB_PREFIX')]['currentNode']);
            unset($this->input->session[config('admin','DB_PREFIX')]['menuNow']);
            unset($this->input->session[config('admin','DB_PREFIX')]['bg_listRows']);
            unset($this->input->session[config('admin','SEARCH_PARAMS_KEY')]);
            unset($this->input->session[config('admin','SEARCH_PARAMS_KEY_PREV')]);
        }
        $this->redirect(config('admin','USER_AUTH_GATEWAY'));
    }



}