import '../styles/404Page.css'

const NotFoundPage = () => {

    return (
        <div className="not-found-container">
            <h1 className="not-found-text">404 Not Found</h1>
            <p className="not-found-description">Oops! The page you're looking for doesn't exist.</p>
            {/* <img className="not-found-image" src="path/to/your/image.jpg" alt="404 Image" /> */}
        </div>
    )
}

export default NotFoundPage;