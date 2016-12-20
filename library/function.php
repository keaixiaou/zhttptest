<?php
/**
 * Created by PhpStorm.
 * User: zhaoye
 * Date: 16/7/16
 * Time: 下午2:57
 */


function config($key, $field=''){
    if($field===''){
        return \ZPHP\Core\Config::get($key);
    }else{
        return \ZPHP\Core\Config::getField($key, $field);
    }

}

function table($tableName){
    return \ZPHP\Core\Db::getInstance()->table($tableName);
}

function collection($collectionName){
    return \ZPHP\Core\Db::collection($collectionName);
}

function cache($key, $value='', $expire=3600){
    $cache = \ZPHP\Cache\Factory::getInstance();
    if($value===null){
        return $cache->delete($key);
    }
    if('' === $value){
        return $cache->get($key);
    }
    return $cache->set($key, $value, $expire);
}


function url($str){
    if($str[0]!='/'){
        $str = '/'.$str;
    }
    return $str;
}