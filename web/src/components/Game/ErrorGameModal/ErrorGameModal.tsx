import { Modal } from '../../Modal/Modal';

export function ErrorGameModal() {
  return (
    <Modal onClose={() => window.location.reload()}>
      <span>Connection error!</span>
      <span>Refresh the page and try again!</span>
    </Modal>
  );
}