import { PropsWithChildren } from "react";
import { CloseButtonSVG } from "..";

type ModalProps = {
    isOpen: boolean;
    closeModal: () => void;
};

export function Modal({ isOpen, closeModal, children }: PropsWithChildren<ModalProps>) {
    if (!isOpen) {
        return null;
    }

    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div className="modal__overlay" onClick={closeModal}>
            <div className="modal__content" onClick={handleModalClick}>
                <div className="modal__close-btn" onClick={closeModal}>
                    <CloseButtonSVG />
                </div>
                <div className="modal__children-container">{children}</div>
            </div>
        </div>
    );
}
