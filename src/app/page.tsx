import SplashScreen from './components/Splashscreen';
import './css/globals.css';

export default function Home() {
  return (
    <div className="app">
      <div className="app-container">
        <div className="app-container__content">
          <SplashScreen></SplashScreen>
        </div>
      </div>
    </div>
  );
}
