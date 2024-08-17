import { useCallback, useEffect, useRef, useState } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';


// recupère l'ensemble des ids
const storeIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
// tableau d'objet de lieu basé sur le tableau d'id
const storedPlaces = storeIds.map((id) => 
  AVAILABLE_PLACES.find((place)=> place.id === id)
);

function App() {

  // gére l'état d'ouverture ou de fermeture du modal
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const selectedPlace = useRef();
  // état qui gère les places disponibles
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  // nous avons utiliser useEffect pour deux raison d'une part vu que  
  // la récupération de l'emplacement de l'utilisateur prendra du temps  
  // le composant sera rendu avant la récuperation de l'emplacement,
  // d'autre part vu que 
  useEffect(()=>{
    // permet de recuperer l'emplacement de l'utilisateur
    // ensuite nous transmettons les coordonnées de l'utilisatueur
    // à la fonction callback
    navigator.geolocation.getCurrentPosition((position) => {
      // renvoie un tableau de lieux triés 
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES, 
        position.coords.latitude, 
        position.coords.longitude
      );
  
      setAvailablePlaces(sortedPlaces);
    });
  }, [])


  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  // MAJ la liste des lieux sélectionnés dans le stockage de nos navigateurs
  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // recupère tout les ids et de les stockés
    const storeIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    if(storeIds.indexOf(id) === -1){
      localStorage.setItem(
        'selectedPlaces',
        JSON.stringify([id, ...storeIds])
      );
    }
  }

  const handleRemovePlace = useCallback(
    function handleRemovePlace() {
      setPickedPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
      );
      setModalIsOpen(false);
  
  
      // Maj des éléments stockés en mémoire après suppression d'un élément
      const storeIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
      localStorage.setItem('selectedPlaces', 
        JSON.stringify(storeIds.filter((id) => 
        id !== selectedPlace.current))
      )
    }, []
  )


  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
