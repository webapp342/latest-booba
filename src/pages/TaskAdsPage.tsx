import { useEffect, useRef } from "react";
import styles from "./task.module.css";

/**
  * Check Typescript section
  * and add types for <adsgram-task> typing
*/

interface TaskProps {
  debug: boolean;
  blockId: string;
}

export const Task = ({ debug, blockId }: TaskProps) => {
  const taskRef = useRef<AdsgramTaskElement>(null);

  useEffect(() => {
    const handler = (event: CustomEvent<string>) => {
      // event.detail contains your block id
      alert(`reward, detail = ${event.detail}`);
    };
    const task = taskRef.current;

    if (task) {
      task.addEventListener("reward", handler);
    }

    return () => {
      if (task) {
        task.removeEventListener("reward", handler);
      }
    };
  }, []);

  if (!customElements.get("adsgram-task")) {
    return null;
  }

  return (
    <adsgram-task
      className={styles.task}
      data-block-id={blockId}
      data-debug={debug}
      ref={taskRef}
    >
      <span slot="reward" className={styles.reward}>
        10 BBLIP
      </span>
      <div slot="button" className={styles.button}>
        Earn
      </div>
      <div slot="done" className={styles.button_done}>
        Completed
      </div>
    </adsgram-task>
  );
};