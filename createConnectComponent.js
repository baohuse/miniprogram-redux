
import { globalStore } from './index';
import getStateFromData from './utils/getStateFromData';
import { shallowEqual } from './utils/shallowEqual';
import { diffData } from './utils/diff';
import { isEmptyObject } from './utils/isEmptyObject';

import { defaultMapStateToData, defaultMapDispatchToMethods } from './createConnectPage';
import { isObject } from './utils/isObject';

export default function createConnectComponent(Component) {
    const __OriginalComponent = Component;

    return function connectComponent(componentConfig, mapStateToData, mapDispatchToMethods, store) {
        const { subscribe, getState, dispatch } = globalStore || store;
        const shouldSubscribe = Boolean(mapStateToData);
        const finalMapStateToData = mapStateToData || defaultMapStateToData;
        const finalMapDispatchToMethods = mapDispatchToMethods || defaultMapDispatchToMethods;

        let unsubscribe;

        function computeMappedState(originalData) {
            const state = getState();
            const mappedState = finalMapStateToData(state);
            return mappedState;
        }

        function handleChange() {
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
        }

        /**
         * 组件 attached 生命周期回调
         */
        function attached() {
            if (shouldSubscribe && !unsubscribe) {
                unsubscribe = subscribe(handleChange.bind(this));
                handleChange.call(this)
            }

            if (isObject(componentConfig.lifetimes) && typeof componentConfig.lifetimes.attached === 'function') {
                componentConfig.lifetimes.attached.call(this);
            }
        }

        /**
         * 组件 detached 生命周期回调
         */
        function detached() {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
                unsubscribe = undefined;
            }

            if (isObject(componentConfig.lifetimes) && typeof componentConfig.lifetimes.detached === 'function') {
                componentConfig.lifetimes.detached.call(this);
            }
        }

        return __OriginalComponent({
            ...componentConfig,

            data: {
                ...componentConfig.data,
                ...computeMappedState()
            },

            lifetimes: {
                ...componentConfig.lifetimes,
                attached,
                detached,
            },

            methods: {...componentConfig.methods,  ...finalMapDispatchToMethods(dispatch)},
        })
    }
}