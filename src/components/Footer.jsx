export default function Footer() {
  return (
    <footer>
      <p>
        &copy; {new Date().getFullYear()} Vite. All rights reserved. |{" "}
        <a href="/privacy">Privacy Policy</a> |{" "}
        <a href="/terms">Terms of Service</a>
      </p>
    </footer>
  );
}
