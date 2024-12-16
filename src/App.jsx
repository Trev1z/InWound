import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [artworks, setArtworks] = useState([]); // Armazena as obras carregadas
  const [filteredArtworks, setFilteredArtworks] = useState([]); // Armazena as obras filtradas
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Termo de pesquisa
  const [favorites, setFavorites] = useState([]);
  const [viewFavorites, setViewFavorites] = useState(false);

  const API_URL = "https://api.artic.edu/api/v1/artworks";

  // Função para buscar todas as obras
  const fetchArtworks = async () => {
    try {
      const response = await fetch(`${API_URL}?limit=20&fields=id,title,image_id,artist_title,place_of_origin,dimensions`);
      const data = await response.json();
      setArtworks(data.data); // Armazena todas as obras
      setFilteredArtworks(data.data); // Inicialmente, exibe todas as obras
    } catch (error) {
      console.error("Erro ao buscar as obras:", error);
    }
  };

  // Chama a função para carregar todas as obras ao iniciar o app
  useEffect(() => {
    fetchArtworks();
  }, []);

  // Função chamada ao digitar na pesquisa
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Função chamada ao clicar no botão "Pesquisar"
  const handleSearchClick = () => {
    if (searchQuery === "") {
      setFilteredArtworks(artworks); // Exibe todas as obras se não houver termo de pesquisa
    } else {
      const filtered = artworks.filter((artwork) =>
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArtworks(filtered);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery(""); // Limpa a consulta de busca
    setFilteredArtworks(artworks); // Recarrega todas as obras
  };

  const handleBackToGallery = () => {
    setSearchQuery(""); // Limpa o campo de pesquisa
    setFilteredArtworks(artworks); // Exibe todas as obras
    setSelectedArtwork(null); // Limpa a obra selecionada
  };

  // Função para adicionar/remover dos favoritos
  const toggleFavorite = (artwork) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.id === artwork.id)) {
        return prevFavorites.filter((fav) => fav.id !== artwork.id); // Remove se já for favorito
      } else {
        return [...prevFavorites, artwork]; // Adiciona aos favoritos
      }
    });
  };

  const isFavorite = (artwork) => {
    return favorites.some((fav) => fav.id === artwork.id);
  };

  const handleToggleFavoritesView = () => {
    setViewFavorites(!viewFavorites);
  };

  return (
    <div className="app">
      <h1>Galeria de Arte</h1>
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar obra de arte"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button className="search-button" onClick={handleSearchClick}>
          Pesquisar
        </button>
        {searchQuery && (
          <button className="clear-search" onClick={handleClearSearch}>
            Limpar
          </button>
        )}
        <button className="back-to-gallery" onClick={handleBackToGallery}>
          Voltar à Galeria
        </button>
      </div>

      {selectedArtwork ? (
        <ArtworkDetails
          artwork={selectedArtwork}
          onBack={handleBackToGallery} // Altera para a função de voltar à galeria
          toggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      ) : (
        <ArtworkList
          artworks={filteredArtworks} // Passa as obras filtradas para a lista
          onSelect={setSelectedArtwork}
          toggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      )}

      <button className="favorites-button" onClick={handleToggleFavoritesView}>
        {viewFavorites ? "Voltar para a Galeria" : "Ver Meus Favoritos"}
      </button>

      {viewFavorites && (
        <div className="favorites-section">
          <h2>Meus Favoritos</h2>
          <ArtworkList
            artworks={favorites}
            onSelect={setSelectedArtwork}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        </div>
      )}
    </div>
  );
};

const ArtworkList = ({ artworks, onSelect, toggleFavorite, isFavorite }) => (
  <div className="artwork-list">
    {artworks.map((artwork) => (
      <div
        key={artwork.id}
        className="artwork-card"
        onClick={() => onSelect(artwork)}
      >
        {artwork.image_id ? (
          <img
            src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/800,/0/default.jpg`}
            alt={artwork.title}
          />
        ) : (
          <div className="placeholder">Sem Imagem</div>
        )}
        <h2>{artwork.title}</h2>
        <button
          className={`favorite-button ${isFavorite(artwork) ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation(); // Evita a seleção da obra ao clicar no botão de favorito
            toggleFavorite(artwork);
          }}
        >
          <span className="heart-icon">{isFavorite(artwork) ? "❤️" : "🤍"}</span>
          Favoritar
        </button>
      </div>
    ))}
  </div>
);

const ArtworkDetails = ({ artwork, onBack, toggleFavorite, isFavorite }) => (
  <div className="artwork-details">
    <button onClick={onBack} className="back-button">
      Voltar à Galeria
    </button>
    <h2>{artwork.title}</h2>
    {artwork.image_id && (
      <img
        src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/1200,/0/default.jpg`}
        alt={artwork.title}
      />
    )}
    <p>
      <strong>Artista:</strong> {artwork.artist_title || "Desconhecido"}
    </p>
    <p>
      <strong>Origem:</strong> {artwork.place_of_origin || "Desconhecido"}
    </p>
    <p>
      <strong>Dimensões:</strong> {artwork.dimensions || "Não disponível"}
    </p>
    <button
      className={`favorite-button ${isFavorite(artwork) ? "active" : ""}`}
      onClick={() => toggleFavorite(artwork)}
    >
      <span className="heart-icon">{isFavorite(artwork) ? "❤️" : "🤍"}</span>
      {isFavorite(artwork) ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
    </button>
  </div>
);

export default App;