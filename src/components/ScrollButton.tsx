import { Dispatch, SetStateAction, useRef } from "react";
import { motion } from "framer-motion";

export const ScrollableButtons = ({
  questions,
  setInput,
  sendMessage,
}: {
  questions: { name: string; value: string }[];
  setInput: Dispatch<
    SetStateAction<{
      name: string;
      value: string;
    }>
  >;
  sendMessage: () => Promise<void>;
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-full overflow-hidden">
      <div className="w-[200%] relative mt-2 flex">
        <motion.div
          ref={scrollRef}
          className="flex gap-4 whitespace-nowrap px-2"
          initial={{ x: 0 }}
          animate={{ x: ["0%", "-100%"] }} // Di chuyển từ phải sang trái
          transition={{ ease: "linear", duration: 30, repeat: Infinity }} // Lặp vô hạn
        >
          {questions.map(
            (
              q,
              index // Lặp lại danh sách để tránh trống
            ) => (
              <form
                key={index}
                onSubmit={async (e) => {
                  e.preventDefault();
                  await sendMessage();
                }}
              >
                <button
                  type="submit"
                  onClick={() => setInput({ name: q.name, value: q.value })}
                  className="bg-green-600 select-none hover:bg-green-700 cursor-pointer rounded-full py-1.5 px-4 text-white text-[14px] min-w-[100px] text-center"
                >
                  {q.name}
                </button>
              </form>
            )
          )}
        </motion.div>
        <motion.div
          ref={scrollRef}
          className="flex gap-4 whitespace-nowrap px-2"
          initial={{ x: 0 }}
          animate={{ x: ["0%", "-100%"] }} // Di chuyển từ phải sang trái
          transition={{ ease: "linear", duration: 30, repeat: Infinity }} // Lặp vô hạn
        >
          {questions.map(
            (
              q,
              index // Lặp lại danh sách để tránh trống
            ) => (
              <form
                key={index}
                onSubmit={async (e) => {
                  e.preventDefault();
                  await sendMessage();
                }}
              >
                <button
                  type="submit"
                  onClick={() => setInput({ name: q.name, value: q.value })}
                  className="bg-green-600 select-none hover:bg-green-700 cursor-pointer rounded-full py-1.5 px-4 text-white text-[14px] min-w-[100px] text-center"
                >
                  {q.name}
                </button>
              </form>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
};
