import Link from 'next/link'

export default function DisabledTabItem(props) {
    return (
        <div>
            <div
                className={
                    "flex items-center text-gray-400 rounded-[20px] whitespace-nowrap px-5 py-3 bg-gray-50/50 hover:cursor-not-allowed transition"
                }
            >

                {props.label}
            </div>
        </div>
    );
}
