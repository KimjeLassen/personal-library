import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();
  return (
    <>
      <header className="header">
        <h1 className ="title">{t('library header')}</h1>
        <p className="subtitle">Organize your collection</p>
      </header>
      
      <main className="main-content">
        <div className="categories-grid">
          <Link to="/books" className="category-link">
            <div className="category-card books">
              <div className="category-icon">📚</div>
              <h2 className="category-title">Books</h2>
              <p className="category-description">Reading collection</p>
            </div>
          </Link>
          
          <Link to="/games" className="category-link">
            <div className="category-card games">
              <div className="category-icon">🎮</div>
              <h2 className="category-title">Games</h2>
              <p className="category-description">Gaming library</p>
            </div>
          </Link>
          
          <Link to="/vinyls" className="category-link">
            <div className="category-card vinyls">
              <div className="category-icon">💿</div>
              <h2 className="category-title">Vinyls</h2>
              <p className="category-description">Music collection</p>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}

export default Home;
