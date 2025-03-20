import Toast from "react-native-toast-message";

export enum TOAST_TYPE {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info'
}
export const showToast = (type, message) => {
    Toast.show({
        type: type,
        text1: message
    });
}

