import { Link } from "react-router-dom";
import { LOGIN_ROUTE } from "../../constants";

const Search = () => {
    return (
        <div>
            <p>Search page</p>
            <Link to={LOGIN_ROUTE}>Login</Link>
        </div>
    );
};

export default Search;
