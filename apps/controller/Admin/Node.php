<?php
/**
 * Created by PhpStorm.
 * User: zhaoye
 * Date: 2016/12/20
 * Time: 下午6:39
 */
namespace controller\Admin;

use ZPHP\Core\Db;
use ZPHP\Core\Log;

class Node extends Common{
    /**
    +----------------------------------------------------------
     * 默认列表操作
    +----------------------------------------------------------
     */
    public function index() {
        //
        $map = array();
        $param = array();
        // 列表过滤器，生成查询Map对象
        if ( method_exists( $this, '_filter' ) ) {
            $this->_filter( $map, $param );
        }
        //
        $this->input->session[config('admin','DB_PREFIX')]['menuNow'] = 'Node';
        $this->model = Db::table('admin_node');
        if ( !empty( $this->model ) ) {
            yield $this->_list ( $this->model, $map, $param );
            //$data = $model->getLastSql();
        }
        //

        $content = $this->fetch();
        $this->adminReturn($content, null, true);
    }
}