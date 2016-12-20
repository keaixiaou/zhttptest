<?php
/**
 * Created by PhpStorm.
 * User: zhaoye
 * Date: 2016/12/20
 * Time: 下午2:33
 */

namespace controller\Admin;

use org\Page;
use service\RBAC;
use ZPHP\Core\Db;
use ZPHP\Core\Log;

class Common extends Admin{
    protected $model;
    public function _init(){
        $state = true;
        //登录识别
        if(!$this->input->session[config('admin','USER_AUTH_KEY')]){
            $this->jsonReturn(['status'=>false,'act'=>'reload']);
            $state = false;

        }
        // 用户权限检查
        if ( config('admin','USER_AUTH_ON') && !in_array('Admin', explode(',', config('admin','NOT_AUTH_MODULE'))) ) {
            if ( !RBAC::AccessDecision() ) {
                // 没有权限 抛出错误
                $data['status'] = false;
                $data['act'] = 'pop';
                $data['info'] = "没有权限";
                $this->jsonReturn($data);
                $state = false;
            }
        }
        return $state;
    }


    /**
    +----------------------------------------------------------
     * 根据表单生成查询条件
     * 进行列表过滤
    +----------------------------------------------------------
     * @access protected
    +----------------------------------------------------------
     * @param Model $model 数据对象
     * @param HashMap $map 过滤条件
     * @param HashMap $param 参数
     * @param string $pk 主键
     * @param string $sortBy 排序
     * @param boolean $asc 是否正序
    +----------------------------------------------------------
     * @return void
    +----------------------------------------------------------
     */
    protected function _list($model, $map, $param, $pk='id', $sortBy='', $asc=false) {
        // 排序字段 默认为主键名
        if ( isset ( $this->input->request['order'] ) ) {
            $order = $this->input->request['order'];
        }
        else {
            $order = !empty( $sortBy ) ? $sortBy : $pk;
        }
        $param['order'] = $order;

        // 排序方式默认按照倒序排列
        if ( isset( $this->input->request['sort'] ) ) {
            $sort = $this->input->request['sort'];
        }
        else {
            $sort = $asc ? 'asc' : 'desc';
        }
        $param['sort'] = $sort;
        //
        $param_str = '';
        foreach ( $param as $key => $val ) {
            if ( empty($param_str) )
                $param_str = "$key=" . $val;
            else
                $param_str .= "&$key=" . $val;
        }
        $this->input->session[config('admin','SEARCH_PARAMS_KEY')] = $param_str;
        // 取得满足条件的记录数
        $count = yield $model->where( $map )->count( $pk );
        //
        if ($count > 0) {
            // 创建分页对象
            if ( !empty( $this->input->request['listRows'] ) ) {
                $listRows = $this->input->request['listRows'];
                $this->input->session[config('admin','DB_PREFIX')]['bg_listRows'] = $listRows;
            }
            else {
                $listRows = $this->input->session[config('admin','DB_PREFIX')]['bg_listRows'];
            }
            $nowPage = !empty($this->input->request[config('admin','VAR_PAGE')])?intval($this->input->request[config('admin','VAR_PAGE')]):1;
            $pg = new Page( $count, $listRows, $nowPage );
            // 分页查询数据
            if (empty($this->input->request['p'])){
                $voList = yield $model->where($map)->order( "`".$order."` ".$sort)->limit($pg->firstRow.','.$pg->listRows)->get();
            }else {
                $this->assign ( 'p', $this->input->request['p'] );
                $voList = yield $model->where($map)->order( "`".$order."` ".$sort)->limit($pg->listRows*($this->input->request['p']-1).','.$pg->listRows)->get();
            }

//     		Log::write( Db::getLastSql());
            // 数据处理
            if ( method_exists( $this, '_processer' ) ) {
                yield $this->_processer( $voList );
            }
            // 分页跳转的时候保证查询条件
            $pg->parameter = $param_str;
            $p = config('admin','VAR_PAGE');
            $this->input->session[config('admin','SEARCH_PARAMS_KEY')] = $param_str."&$p=".$pg->nowPage;
            // 分页显示
            $page = $pg->show();
            // 模板赋值显示

            $this->assign ( 'list', $voList );
            $this->assign ( "page", $page );
        }
        return $voList;
    }
}