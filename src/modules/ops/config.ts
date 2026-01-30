import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default () => {
  return {
    // 模块名称
    name: '运维管理',
    // 模块描述
    description: 'Docker项目与服务器管理中控',
    // 中间件，只对本模块有效
    middlewares: [],
    // 中间件，全局有效
    globalMiddlewares: [],
    // 模块加载顺序
    order: 10,
  } as ModuleConfig;
};
