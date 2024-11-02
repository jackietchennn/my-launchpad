import { Col, Modal, Row } from "antd";

import Connectors, { Config, ConnectorNames, walletLocalStorageKey, connectorLocalStorageKey } from "@/types/Connecter";
import { useWallet } from "@/hooks/useWallets";
import { useAppDispatch } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";

const WalletModal = () => {
    const { walletModalVisible, showWallet } = useWallet();
    const { login } = useAuth();

    const triggerConnectorClick = (connector: Config) => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        // Since iOS does not support Trust Wallet we fall back to WalletConnect
        if (connector.title === "Trust Wallet" && isIOS) {
            login(ConnectorNames.WalletConnect);
        } else {
            login(connector.connectorId);
        }

        localStorage.setItem(walletLocalStorageKey, connector.title)
        localStorage.setItem(connectorLocalStorageKey, connector.connectorId)
        showWallet(false);
    };

    /** wallet pannel */
    const ConnectPannel = (
        <>
            <Row justify="start">
                <div className="text-[22px] text-[#000] text-center leading-[60px]">Connect Wallet</div>
            </Row>
            <Row justify="center" gutter={[16, 24]} className="max-h-[50vh] overflow-y-scroll">
                {Connectors.map((connector, index) => {
                    return (
                        <Col
                            key={index}
                            span={24}
                            className="!flex w-full h-[70px] px-3 py-0 rounded-[18px] bg-[#f4f4f4] cursor-pointer leading-[70px] hover:bg-[#b4b4b4]"
                            onClick={() => triggerConnectorClick(connector)}
                        >
                            <connector.icon className="w-[54px] h-[54px] rounded-full bg-[length:80%] bg-white bg-center align-middle"></connector.icon>
                            <span className="text-[18px] text-[#000] ml-3">{connector.title}</span>
                        </Col>
                    );
                })}
            </Row>
        </>
    );

    return (
        <Modal open={walletModalVisible} title={null} footer={null} onCancel={() => showWallet(false)}>
            {ConnectPannel}
        </Modal>
    );
};

export default WalletModal;
