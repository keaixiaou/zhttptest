<?php
/**
 * Created by PhpStorm.
 * User: zhaoye
 * Date: 2016/12/20
 * Time: 下午2:58
 */

namespace model;
use ZPHP\Core\Db;

class AdminNode{
    public function getMenuByType($type){
        $condition['status'] = 1;
        $condition['level'] = 2;
        $condition['pid'] = 1;	// 后台管理
        $condition['type'] = $type;
        //
        $list = yield Db::table('admin_node')->where($condition)->order('sort asc')->get();
        //
        return $list;
    }
}