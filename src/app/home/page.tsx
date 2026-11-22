'use client'
import styles from "./styles.module.css"
import {FormInput} from "@/_components/form/InputSearch";
import {Text} from "@/_components/Text";
import {Card} from "@/_components/card/Card";
import {CardSlider} from "@/_components/slider/slider";
import {Header} from "@/_components/header/header";
import {useEffect, useState} from "react";
import {Post} from "@/_models/posts";
import { getPosts } from "@/_features/posts/actions";
import {CardSkeleton} from "@/_components/card/CardSkeleton";

export default function Home() {
    const [data, setData] = useState<Post[]>([])
    useEffect(() =>{
        getPosts().then(res => setData(res)).catch(e => console.error(e))
    }, [])

    return(
        <>
            <Header/>
            <div className={styles.titles}>
                <Text size={'3xl'} align={'center'} weight={'bold'}>Where are you going ?</Text>
                <Text size={'lg'} align={'center'}>Discover the best food & drink deals around you.</Text>
            </div>
            <FormInput/>
            <div className={styles.bestDeals}>
                <Text size={'2xl'} weight={'bold'} as={'h2'}>Best deals today</Text>
                {
                    data && data.length > 0 ? <Card data={data[0]}/> : <CardSkeleton/>
                }
            </div>

            {
                data && data.length > 0 &&
                <div className={styles.bestDeals}>
                    <Text size={'2xl'} weight={'bold'} as={'h2'}>Best deals today xxx</Text>
                    <CardSlider data={data}/>
                </div>
            }

            <div style={{height: '90px'}}/>
        </>
    )
}
