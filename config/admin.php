<?php
/**
 * Created by PhpStorm.
 * User: zhaoye
 * Date: 2016/12/19
 * Time: 下午8:43
 */

return [
  'admin' => [
      'USER_AUTH_ON'              =>  true,
      'USER_AUTH_TYPE'			=>  1,		// 默认认证类型 1 登录认证 2 实时认证
      'USER_AUTH_KEY'             =>  'vtauthId',	// 用户认证SESSION标记
      'ADMIN_AUTH_KEY'			=>  'vtadministrator',
      'USER_AUTH_MODEL'           =>  'admin_user',	// 默认验证数据表模型
      'AUTH_PWD_ENCODER'          =>  'md5',	// 用户认证密码加密方式
      'USER_AUTH_GATEWAY'         =>  '/Admin/APublic/login',// 默认认证网关
      'NOT_AUTH_MODULE'           =>  'Public,Crontab',	// 默认无需认证模块
      'REQUIRE_AUTH_MODULE'       =>  '',		// 默认需要认证模块
      'NOT_AUTH_ACTION'           =>  '',		// 默认无需认证操作
      'REQUIRE_AUTH_ACTION'       =>  '',		// 默认需要认证操作
      'GUEST_AUTH_ON'             =>  false,	// 是否开启游客授权访问
      'GUEST_AUTH_ID'             =>  0,    	// 游客的用户ID
      'DB_LIKE_FIELDS'            =>  'title|remark',
      'RBAC_ROLE_TABLE'           =>  'admin_role',
      'RBAC_USER_TABLE'           =>  'admin_role_user',
      'RBAC_ACCESS_TABLE'         =>  'admin_access',
      'RBAC_NODE_TABLE'           =>  'admin_node',
      'SHOW_PAGE_TRACE'           =>  false,	//显示调试信息

      'BACKGROUND_TITLE'			=>  '后台管理系统',
      'SEARCH_PARAMS_KEY'			=>  'search_params',
      'SEARCH_PARAMS_KEY_PREV'	=>  'search_params_prev',
  ]
];