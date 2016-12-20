<?php
/**
 * Created by PhpStorm.
 * User: zhaoye
 * Date: 2016/12/20
 * Time: 上午10:12
 */

namespace controller\Admin;
use org\RBAC;
use ZPHP\Controller\Controller;
use ZPHP\Core\App;
use ZPHP\Core\Db;
use ZPHP\Core\Log;

class Index extends Controller{
    public function index(){
        if(!isset($this->input->session[config('admin','USER_AUTH_KEY')])){
           return $this->redirect(config('admin','USER_AUTH_GATEWAY'));
        }

        yield $this->menu();
        //
        if ( !isset($this->input->session[config('admin','DB_PREFIX')]['menuNow']) ) {
            $this->input->session[config('admin','DB_PREFIX')]['menuNow'] = 'SysInfo';
        }

        if ( !isset($this->input->session[config('admin','DB_PREFIX')]['menuNow']) ) {
            $this->input->session[config('admin','DB_PREFIX')]['menuNow'] = 'SysInfo';
        }
        $this->assign('icon',config('admin','ICON_LIST'));
        $this->assign('menuNow', $this->input->session[config('admin','DB_PREFIX')]['menuNow']);	// 默认菜单
        //
        $this->display();
    }

    // 菜单
    protected function menu() {
        if(isset($this->input->session[config('admin','USER_AUTH_KEY')])) {
            //显示菜单项
            $menu = array();
            if ( isset($this->input->session[config('admin','DB_PREFIX')]['menu'.$this->input->session[config('admin','USER_AUTH_KEY')]]) ) {
                //如果已经缓存，直接读取缓存
                $menu = $this->input->session[config('admin','DB_PREFIX')]['menu'.$this->input->session[config('admin','USER_AUTH_KEY')]];
            }
            else {
                //读取数据库模块列表生成菜单项
                if ( isset($this->input->session[config('admin','DB_PREFIX')]['_ACCESS_LIST']) ) {
                    $accessList = $this->input->session[config('admin','DB_PREFIX')]['_ACCESS_LIST'];
                }
                else {
                    $accessList = yield RBAC::getAccessList($this->input->session[config('admin','USER_AUTH_KEY')]);
                }
                //
                $menuItem = array();
                $node = App::model('AdminNode');
                $variable = App::model('AdminVariable');
                $menu_types = yield $variable->getAryValue('menu_types');
                foreach ($menu_types as $key => $value) {
                    $list = yield $node->getMenuByType($key+1);
                    if ( !empty($list) ) {
                        // 模块访问权限

                        foreach ( $list as $key_sub => $module) {
                            if ( !isset($accessList[strtoupper('Admin')][strtoupper($module['name'])]) && $this->input->session[config('admin','ADMIN_AUTH_KEY')]!==true) {
                                unset($list[$key_sub]);
                            }
                        }
                        //
                        if ( !empty($list) ) {
                            $menuItem['title'] = $value;
                            $menuItem['list'] = $list;
                            array_push($menu, $menuItem);
                        }
                    }
                }
                krsort($menu);
                // 缓存菜单
                $this->input->session[config('admin','DB_PREFIX')]['menu'.$this->input->session[config('admin','USER_AUTH_KEY')]]	= $menu;
            }
            //
            $this->assign('menu', $menu);
        }
    }
}