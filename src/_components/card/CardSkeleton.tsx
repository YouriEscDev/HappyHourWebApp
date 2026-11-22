import styles from "./styles.module.css"
import sk from './skeleton.module.css';

export function CardSkeleton() {
    return (
        <div className={styles.card} aria-busy="true" aria-live="polite">
            {/* image, same size as the real one (350x150) */}
            <div className={`${sk.shimmer} ${sk.image}`} />

            <div className={styles.data}>
                <div className={`${sk.shimmer} ${sk.line} ${sk.small}`} />   {/* TUESDAY 17H-19H */}
                <div className={`${sk.shimmer} ${sk.line} ${sk.title}`} />   {/* title */}
                <div className={`${sk.shimmer} ${sk.line} ${sk.address}`} /> {/* line1 */}
                <div className={styles.location}>
                    <div className={`${sk.shimmer} ${sk.dot}`} />            {/* pin icon */}
                    <div className={`${sk.shimmer} ${sk.line} ${sk.city}`} />
                </div>
                <div className={styles.button}>
                    <div className={`${sk.shimmer} ${sk.btn}`} />
                </div>
            </div>
        </div>
    );
}

export function CardSkeletonList({ count = 6 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </>
    );
}