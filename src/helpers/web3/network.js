import networks from "../../network/network.json";

const getNetworkImage = (id) => {
    const projectNetwork = networks.filter(network => network.chainId == id);
    return projectNetwork[0].icon;
}

const getNetworkName = (id) => {
    const projectNetwork = networks.filter(network => network.chainId == id);
    return projectNetwork[0].displayName;
}

export default {
    getNetworkName,
    getNetworkImage
}