
import { globalStore } from './index';
import getStateFromData from './utils/getStateFromData';
import { shallowEqual } from './utils/shallowEqual';
import { diffData } from './utils/diff';
import { isEmptyObject } from './utils/isEmptyObject';

export const defaultMapStateToData = () => ({});
export const defaultMapDispatchToMethods = dispatch => ({ dispatch });


export default function createConnectPage(Page) {
    const __OriginalPage = Page;

    return function connectPage(pageConfig, mapStateToData, mapDispatchToMethods, store) {
        const { subscribe, getState, dispatch } = globalStore || store;
        const shouldSubscribe = Boolean(mapStateToData);
        const finalMapStateToData = mapStateToData || defaultMapStateToData;
        const finalMapDispatchToMethods = mapDispatchToMethods || defaultMapDispatchToMethods;


        function computeMappedState(originalData) {
            const state = getState();
            const mappedState = finalMapStateToData(state);
            return mappedState;
        }

        return __OriginalPage({
            ...pageConfig,

            data: {
                ...pageConfig.data,
                ...computeMappedState()
            },

            onLoad: function(options) {
                // todo 页面参数传入mapStateToData  
                this.trySubscribe();
                this.bindDispatchMethodsToPage()
                pageConfig.onLoad && pageConfig.onLoad.bind(this)(options);
            },

            onUnload: function() {
                pageConfig.onUnload && pageConfig.onUnload.bind(this)(...arguments);
                this.tryUnsubscribe()
            },

            onReady: function () {
                pageConfig.onReady && pageConfig.onReady.bind(this)(...arguments);
            },

            /**
             * bindDispatchMethodsToPage 函数用于将dispatch方法映射到页面实例中，以便在页面中调用 Redux 的 dispatch 方法来触发状态变更
             */
            bindDispatchMethodsToPage() {
                if(typeof finalMapDispatchToMethods === 'function') {
                    const dispatchMethods = finalMapDispatchToMethods(dispatch)
                    for (const methodName in dispatchMethods) {
                        if (dispatchMethods.hasOwnProperty(methodName)) {
                            // 绑定每个 dispatch 方法到页面实例
                            this[methodName] = dispatchMethods[methodName];
                        }
                    }
                }
            },

            handleChange() {
                const mappedState = computeMappedState();
                const currentState = getStateFromData(mappedState, this.data);
    
                // 比较旧的从redux映射过来state，跟最新的selector state ， 如果有差异，则setData局部更新
                // diffData 引用微信官网westore diffdata
                if(!shallowEqual(mappedState, currentState)) {
                    const patch = diffData(mappedState, currentState)
                    if(!isEmptyObject(patch)) {
                        this.setData(patch);
                    }
                }
            },


            trySubscribe() {
                if(shouldSubscribe && !this.unsubscribe) {
                    this.unsubscribe = subscribe(this.handleChange)
                }
            },

            tryUnsubscribe() {
                if (this.unsubscribe) {
                  this.unsubscribe();
                  this.unsubscribe = null;
                }
              }
        })
    }
}