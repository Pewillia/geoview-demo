
import GeoViewMap from '../components/GeoViewMap';
import { DEFAULT_CONFIG } from '../constants';
import GeoViewPage from '../components/GeoViewPage';

function DefaultPage() {
  return (
    <GeoViewPage>
      <GeoViewMap config={DEFAULT_CONFIG} />
    </GeoViewPage>
  );
}

export default DefaultPage;
