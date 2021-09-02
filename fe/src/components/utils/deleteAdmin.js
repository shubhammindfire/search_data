import axios from "axios";
import { DELETE_ADMIN_BY_ID_URL } from "../../constants";
import { removeAdminByIndex } from "../../redux/admin/adminActions";

const handleDeleteAdmin = async (
    index,
    id,
    jwt,
    setShowLoadingModal,
    dispatch
) => {
    try {
        setShowLoadingModal(true);
        const response = await axios.delete(DELETE_ADMIN_BY_ID_URL + `/${id}`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });

        if (response.status === 204) {
            dispatch(removeAdminByIndex(index));
            setShowLoadingModal(false);
            return true;
        }
        setShowLoadingModal(false);
        return false;
    } catch (error) {
        setShowLoadingModal(false);
        return false;
    }
};
export default handleDeleteAdmin;
