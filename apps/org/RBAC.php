<?php
/**
 * Created by PhpStorm.
 * User: zhaoye
 * Date: 2016/12/20
 * Time: 上午11:13
 */
namespace org;

use ZPHP\Core\App;
use ZPHP\Core\Db;
use ZPHP\Core\Log;

class RBAC{
    // 认证方法
    static public function authenticate($map) {
        //使用给定的Map进行认证
        $temp = $map['pwd'];
        unset($map['pwd']);

        $rst = yield App::model('AdminUser')->getInfoByMap($map);
        if ($temp==config('admin','USER_AUTH_KEY') && !empty($rst)) {
            $rst['password'] = md5($temp);
        }
        return $rst;
    }

    //用于检测用户权限的方法,并保存到Session中
    static function saveAccessList($authId=null)
    {
        if(null===$authId)   $authId = $_SESSION[C('USER_AUTH_KEY')];
        // 如果使用普通权限模式，保存当前用户的访问权限列表
        // 对管理员开发所有权限
        if(C('USER_AUTH_TYPE') !=2 && !isset($_SESSION[C('ADMIN_AUTH_KEY')]) )
            $_SESSION[C('ADMIN_AUTH_KEY')]['_ACCESS_LIST']	=	RBAC::getAccessList($authId);
        return ;
    }

    // 取得模块的所属记录访问权限列表 返回有权限的记录ID数组
    static function getRecordAccessList($authId=null,$module='') {
        if(null===$authId)   $authId = $_SESSION[C('USER_AUTH_KEY')];
        if(empty($module))  $module	=	MODULE_NAME;
        //获取权限访问列表
        $accessList = RBAC::getModuleAccessList($authId,$module);
        return $accessList;
    }

    //检查当前操作是否需要认证
    static function checkAccess() {
        //如果项目要求认证，并且当前模块需要认证，则进行权限认证
        if ( C('USER_AUTH_ON') ) {
            $_module = array();
            $_action = array();
            if ("" != C('REQUIRE_AUTH_MODULE')) {
                //需要认证的模块
                $_module['yes'] = explode(',',strtoupper(C('REQUIRE_AUTH_MODULE')));
            }
            else {
                //无需认证的模块
                $_module['no'] = explode(',',strtoupper(C('NOT_AUTH_MODULE')));
            }
            //检查当前模块是否需要认证
            if((!empty($_module['no']) && !in_array(strtoupper(MODULE_NAME),$_module['no'])) || (!empty($_module['yes']) && in_array(strtoupper(MODULE_NAME),$_module['yes']))) {
                if ("" != C('REQUIRE_AUTH_ACTION')) {
                    //需要认证的操作
                    $_action['yes'] = explode(',',strtoupper(C('REQUIRE_AUTH_ACTION')));
                }
                else {
                    //无需认证的操作
                    $_action['no'] = explode(',',strtoupper(C('NOT_AUTH_ACTION')));
                }
                //检查当前操作是否需要认证
                if ((!empty($_action['no']) && !in_array(strtoupper(ACTION_NAME),$_action['no'])) || (!empty($_action['yes']) && in_array(strtoupper(ACTION_NAME),$_action['yes']))) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        return false;
    }

    // 登录检查
    static public function checkLogin() {
        //检查当前操作是否需要认证
        if(RBAC::checkAccess()) {
            //检查认证识别号
            if(!$_SESSION[C('USER_AUTH_KEY')]) {
                if(C('GUEST_AUTH_ON')) {
                    // 开启游客授权访问
                    if(!isset($_SESSION[C('ADMIN_AUTH_KEY')]['_ACCESS_LIST']))
                        // 保存游客权限
                        RBAC::saveAccessList(C('GUEST_AUTH_ID'));
                }else{
                    // 禁止游客访问跳转到认证网关
                    redirect(PHP_FILE.C('USER_AUTH_GATEWAY'));
                }
            }
        }
        return true;
    }

    //权限认证的过滤器方法
    static public function AccessDecision($groupName=MODULE_NAME) {
        //检查是否需要认证
        if ( RBAC::checkAccess() ) {
            //存在认证识别号，则进行进一步的访问决策
            $accessGuid = md5($groupName.CONTROLLER_NAME.ACTION_NAME);
            if ( empty($_SESSION[C('ADMIN_AUTH_KEY')]) || $_SESSION[C('ADMIN_AUTH_KEY')]!==true) {
                if(C('USER_AUTH_TYPE')==2) {
                    //加强验证和即时验证模式 更加安全 后台权限修改可以即时生效
                    //通过数据库进行访问检查
                    $accessList = RBAC::getAccessList($_SESSION[C('USER_AUTH_KEY')]);
                }
                else {
                    // 如果是管理员或者当前操作已经认证过，无需再次认证
                    if( $_SESSION[$accessGuid]) {
                        return true;
                    }
                    //登录验证模式，比较登录后保存的权限访问列表
                    $accessList = $_SESSION[C('ADMIN_AUTH_KEY')]['_ACCESS_LIST'];
                }
                //判断是否为组件化模式，如果是，验证其全模块名
                if(!isset($accessList[strtoupper($groupName)][strtoupper(CONTROLLER_NAME)][strtoupper(ACTION_NAME)])) {
                    $_SESSION[$accessGuid] = false;
                    return false;
                }
                else {
                    $_SESSION[$accessGuid] = true;
                }
            }
            else{
                //管理员无需认证
                return true;
            }
        }
        return true;
    }

    /**
    +----------------------------------------------------------
     * 取得当前认证号的所有权限列表
    +----------------------------------------------------------
     * @param integer $authId 用户ID
    +----------------------------------------------------------
     * @access public
    +----------------------------------------------------------
     */
    static public function getAccessList($authId)
    {
        // Db方式权限数据
        $db     =   Db::table();
        $table = array(
            'role'=>config('admin','RBAC_ROLE_TABLE'),
            'user'=>config('admin','RBAC_USER_TABLE'),
            'access'=>config('admin','RBAC_ACCESS_TABLE'),
            'node'=>config('admin','RBAC_NODE_TABLE'));
        $sql    =   "select node.id,node.name from ".
            $table['role']." as role,".
            $table['user']." as user,".
            $table['access']." as access ,".
            $table['node']." as node ".
            "where user.user_id='{$authId}' and user.role_id=role.id and ( access.role_id=role.id  or (access.role_id=role.pid and role.pid!=0 ) ) and role.status=1 and access.node_id=node.id and node.level=1 and node.status=1";
        $apps =   yield $db->query($sql);
        $apps = !empty($apps['result'])?$apps['result']:[];
        $access =  array();
        foreach($apps as $key=>$app) {
            $appId	=	$app['id'];
            $appName	 =	 'Admin';
            // 读取项目的模块权限
            $access[strtoupper($appName)]   =  array();
            $sql    =   "select node.id,node.name from ".
                $table['role']." as role,".
                $table['user']." as user,".
                $table['access']." as access ,".
                $table['node']." as node ".
                "where user.user_id='{$authId}' and user.role_id=role.id and ( access.role_id=role.id  or (access.role_id=role.pid and role.pid!=0 ) ) and role.status=1 and access.node_id=node.id and node.level=2 and node.pid={$appId} and node.status=1";
            $modules =   yield $db->query($sql);
            $modules = !empty($modules['result'])?$modules['result']:[];
            // 判断是否存在公共模块的权限
            $publicAction  = array();
            foreach($modules as $key=>$module) {
                $moduleId	 =	 $module['id'];
                $moduleName = $module['name'];
                if('PUBLIC'== strtoupper($moduleName)) {
                    $sql    =   "select node.id,node.name from ".
                        $table['role']." as role,".
                        $table['user']." as user,".
                        $table['access']." as access ,".
                        $table['node']." as node ".
                        "where user.user_id='{$authId}' and user.role_id=role.id and ( access.role_id=role.id  or (access.role_id=role.pid and role.pid!=0 ) ) and role.status=1 and access.node_id=node.id and node.level=3 and node.pid={$moduleId} and node.status=1";
                    $rs =  yield $db->query($sql);
                    $rs = !empty($rs['result'])?$rs['result']:[];
                    foreach ($rs as $a){
                        $publicAction[$a['name']]	 =	 $a['id'];
                    }
                    unset($modules[$key]);
                    break;
                }
            }
            // 依次读取模块的操作权限
            foreach($modules as $key=>$module) {
                $moduleId	 =	 $module['id'];
                $moduleName = $module['name'];
                $sql    =   "select node.id,node.name from ".
                    $table['role']." as role,".
                    $table['user']." as user,".
                    $table['access']." as access ,".
                    $table['node']." as node ".
                    "where user.user_id='{$authId}' and user.role_id=role.id and ( access.role_id=role.id  or (access.role_id=role.pid and role.pid!=0 ) ) and role.status=1 and access.node_id=node.id and node.level=3 and node.pid={$moduleId} and node.status=1";
                $rs =  yield $db->query($sql);
                $rs = !empty($rs['result'])?$rs['result']:[];
                $action = array();
                foreach ($rs as $a){
                    $action[$a['name']]	 =	 $a['id'];
                }
                // 和公共模块的操作权限合并
                $action += $publicAction;
                $access[strtoupper($appName)][strtoupper($moduleName)]   =  array_change_key_case($action,CASE_UPPER);
            }
        }
        return $access;
    }

    // 读取模块所属的记录访问权限
    static public function getModuleAccessList($authId,$module) {
        // Db方式
        $db     =   Db::getInstance(C('RBAC_DB_DSN'));
        $table = array('role'=>C('RBAC_ROLE_TABLE'),'user'=>C('RBAC_USER_TABLE'),'access'=>C('RBAC_ACCESS_TABLE'));
        $sql    =   "select access.node_id from ".
            $table['role']." as role,".
            $table['user']." as user,".
            $table['access']." as access ".
            "where user.user_id='{$authId}' and user.role_id=role.id and ( access.role_id=role.id  or (access.role_id=role.pid and role.pid!=0 ) ) and role.status=1 and  access.module='{$module}' ";
        $rs =   $db->query($sql);
        $access	=	array();
        foreach ($rs as $node){
            $access[]	=	$node['node_id'];
        }
        return $access;
    }
}