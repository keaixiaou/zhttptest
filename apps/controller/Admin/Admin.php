<?php
/**
 * Created by PhpStorm.
 * User: zhaoye
 * Date: 2016/12/20
 * Time: 上午11:08
 */

namespace controller\Admin;

use ZPHP\Controller\Controller;

class Admin extends Controller{
    public function adminReturn($data, $info, $status){
        return $this->jsonReturn(['data'=>$data, 'info'=>$info, 'status'=>$status]);
    }
}