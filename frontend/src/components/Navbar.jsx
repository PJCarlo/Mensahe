import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { authUser } = useAuthStore();
    return (
    <nav>
      <h1>Mensahe</h1>
      <ul>
        {authUser ? (
          <>
            <li>Welcome, {authUser.name}</li>
            <li>Profile</li>
            <li>Logout</li>
          </>
        ) : (
          <>
            <li>Login</li>
            <li>Signup</li>
          </>
        )}
        </ul>
    </nav>
  );
}