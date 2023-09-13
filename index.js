import createConnectPage from './createConnectPage';
import createConnectComponent from './createConnectComponent';

export let globalStore = null;
export function setGlobalStore(store) {
    globalStore = store;
}

const connectPage = createConnectPage(Page);
const connectComponent = createConnectComponent(Component);

export { connectPage, connectComponent }
