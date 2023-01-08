import { auth, googleAuthProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth"


export default function SignInWithGoogleButton() {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'} /> Sign in with Google
    </button>
  )
}