import axios from "axios";
import { DELETE_PROPERTY_RECORD_BY_ID_URL } from "../../constants";
import { removePropertyRecordByIndex } from "../../redux/property_record/propertyRecordActions";

const handleDeletePropertyRecord = async (
    index,
    id,
    jwt,
    setShowLoadingModal,
    dispatch
) => {
    try {
        setShowLoadingModal(true);
        const response = await axios.delete(
            DELETE_PROPERTY_RECORD_BY_ID_URL + `/${id}`,
            {
                headers: { Authorization: `Bearer ${jwt}` },
            }
        );

        if (response.status === 204) {
            dispatch(removePropertyRecordByIndex(index));
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
export default handleDeletePropertyRecord;
