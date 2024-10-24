import GeoViewMap from '../components/GeoViewMap';
import { Button } from '@mui/material';

function PackageSwiperPage() {

  const codeSnippet = `function addSwiper() {
      cgpv.api.maps['mapWM3'].plugins['swiper'].activateForLayer(document.getElementById('mapWM3Input').value);
    }

    function removeSwiper() {
      cgpv.api.maps['mapWM3'].plugins['swiper'].deActivateForLayer(document.getElementById('mapWM3Input').value);
    }

    function removeSwiperAll() {
      cgpv.api.maps['mapWM3'].plugins['swiper'].deActivateAll();
    }`;

  const renderTop = () => {
    const addSwiper = () => {
      //cgpv.api.maps[mapId].plugins['swiper'].activateForLayer(document.getElementById('mapWM3Input').value);
    }

    const removeSwiper = () => {
    }

    const removeSwiperAll = () => {
    }
    return (
      <div>
        <input type="text" id="mapWM3Input" placeholder="Layer ID" />
        <Button variant="contained" size="small" sx={{mx: 1}} color='secondary' onClick={addSwiper}>Add Swiper</Button>
        <Button variant="contained" size="small" sx={{mx: 1}} color='secondary' onClick={removeSwiper}>Remove Swiper</Button>
        <Button variant="contained" size="small" sx={{mx: 1}} color='secondary' onClick={removeSwiperAll}>Remove All Swipers</Button>
      </div>
    );
  }

  const renderBottom = () => {
    return (
      <div>
        <p>
          I am the bottom section
        </p>
      </div>
    );
  }

  return (
      <GeoViewMap 
      config={`package-swiper3-config.json`} 
      configIsFilePath={true}
      codeSnippet={codeSnippet} top={renderTop()} bottom={renderBottom()}>
        <p>
          I am the children section
        </p>
      </GeoViewMap>
  );
}

export default PackageSwiperPage;
