<?php
/**
 * Created by PhpStorm.
 * User: zhaoye
 * Date: 2016/12/20
 * Time: 下午2:59
 */

namespace model;

use ZPHP\Core\Db;

class AdminVariable{
    public function getFieldByMykey($key, $field){
        $info = yield Db::table('admin_variable')->where(['mykey'=>$key])->find();
        return $info[$field];
    }

    public function getAryValue($key){
        $myvalue = yield $this->getFieldByMykey($key, 'myvalue');
        return json_decode($myvalue);
    }


}