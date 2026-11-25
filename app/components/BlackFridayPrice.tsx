import { BLACK_FRIDAY } from "@/app/data/blackFriday";
import styles from "./BlackFridayPrice.module.css";

export default function BlackFridayPrice() {
  const saved = (BLACK_FRIDAY.regularDelivered - BLACK_FRIDAY.price).toFixed(2);
  return (
    <div className={styles.deal}>
      <div className={styles.prices}>
        <s aria-label={`Regular total $${BLACK_FRIDAY.regularDelivered.toFixed(2)}`}>${BLACK_FRIDAY.regularDelivered.toFixed(2)}</s>
        <strong>${BLACK_FRIDAY.price}</strong>
        <span className={styles.savings}>Save ${saved}</span>
      </div>
      <p className={styles.detail}>Regular total includes $5 shipping.</p>
    </div>
  );
}
