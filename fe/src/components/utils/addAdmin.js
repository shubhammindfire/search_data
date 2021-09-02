import axios from "axios";
import { ADD_ADMIN_BY_ID_URL } from "../../constants";
import { addAdmin } from "../../redux/admin/adminActions";

const handleAddAdmin = async (
    index,
    id,
    jwt,
    data,
    setShowLoadingModal,
    dispatch
) => {
    try {
        setShowLoadingModal(true);
        const response = await axios.post(ADD_ADMIN_BY_ID_URL, data, {
            headers: { Authorization: `Bearer ${jwt}` },
        });

        if (response.status === 201) {
            dispatch(addAdmin(index));
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
export default handleAddAdmin;
