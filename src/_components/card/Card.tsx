import styles from "./styles.module.css"
import Image from "next/image";
import {Text} from "@/_components/Text";
import {Button} from "@/_components/Button";
import {Post} from "@/_models/posts";

interface Props{
    data: Post
}
export function Card({data}:Props){
    return(
        <div className={styles.card}>
            <Image src={data.img_url} alt={'Deal img'} width={'350'} height={'150'}/>
            <div className={styles.data}>
                <Text>TUESDAY 17H-19H</Text>
                <Text size={'3xl'} weight={'bold'}>{data.title}</Text>
                <Text weight={'bold'}>{data.address.line1}</Text>
                    <div className={styles.location} style={{marginLeft: '-5px'}}>
                        <span className="material-symbols-outlined">
                          location_on
                        </span>
                        <div>{data.address.city}</div>
                    </div>
                <div className={styles.button}>
                    <Button variant={'primary'} size={'lg'} fullWidth={true}>View Deal</Button>
                </div>
            </div>
        </div>
    )
}