import { defaultConfirmBox, useConfirmBoxStore } from "src/store";


let resolve: (param: any) => void;
const useConfirm = () => {
  const { confirmBox, setConfirmBox } = useConfirmBoxStore();

  const confirm = (args: Record<string, any>) => {
    const {
      title,
      message,
      confirmButtonLabel,
      confirmButtonVariant = 'primary',
      contentClassName = '',
    } = args || {};
    return new Promise((res) => {
      setConfirmBox({
        ...defaultConfirmBox,
        show: true,
        title,
        message,
        confirmButtonLabel,
        confirmButtonVariant,
        contentClassName,
      });
      resolve = res;
    });
  };

  const onConfirm = () => {
    setConfirmBox(defaultConfirmBox);
    resolve(true);
  };

  const onCancel = () => {
    setConfirmBox(defaultConfirmBox);
    resolve(false);
  };

  return { confirm, confirmBox, onCancel, onConfirm };
};

export default useConfirm;
