export const Notification = ({ errorMessage }) => {
    if (!errorMessage) {
        return null
    }
    return (
        <div style={{ color: 'red' }}>
            {errorMessage}
        </div>
    )
}