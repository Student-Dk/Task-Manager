const Message = ({ message, type = 'info' }) => {
  if (!message) {
    return null;
  }

  return <div className={`message message-${type}`}>{message}</div>;
};

export default Message;
