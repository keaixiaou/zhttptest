<?php
/**
 * Created by PhpStorm.
 * User: zhaoye
 * Date: 2016/12/20
 * Time: 上午11:15
 */

namespace model;

use ZPHP\Core\Db;

class AdminUser{

    /**
     * @param $map
     * @return mixed
     */
    public function getInfoByMap($map){
        $info = yield Db::table('admin_user')->where($map)->find();
        return $info;
    }
}