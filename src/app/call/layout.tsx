
interface Props {
    children: React.ReactNode;
}

const LayoutPage = ({ children }: Props) => {
    return (
        <div className="h-screen bg-black">
            {children}
        </div>
    )
}

export default LayoutPage;

