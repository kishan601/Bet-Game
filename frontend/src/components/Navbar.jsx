import { useAuth } from "../context/AuthContext";

const Navbar = ({ gameStarted }) => {
  const { logout } = useAuth();

  return (
    <div style={styles.nav}>
      <h2>Flip&Win</h2>

      <button
        onClick={logout}
        disabled={gameStarted}
        style={{
          ...styles.button,
          opacity: gameStarted ? 0.5 : 1,
          cursor: gameStarted ? "not-allowed" : "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#0f172a",
    color: "white"
  },
  button: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    background: "#ef4444",
    color: "white"
  }
};

export default Navbar;