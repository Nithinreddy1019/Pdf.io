const ChatWithFilePage = ({
    params: {id}
}: {
    params: {
        id: string
    }
}) => {
    return (
        <div>
            Chat here {id}
        </div>
    );
}
 
export default ChatWithFilePage;