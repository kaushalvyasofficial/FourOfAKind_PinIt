import React from 'react'
import { View } from "react-native"
import Carousel from 'react-native-snap-carousel'
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './carousel'


import data from "./data"
import { TouchableOpacity } from 'react-native'

export default function CarouselCards() {
  const isCarousel = React.useRef(null)

  return (
    <View>
    {/*  */}
      <Carousel
        layout="default"
        layoutCardOffset={8}
        ref={isCarousel}
        data={data}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        inactiveSlideShift={1}
        useScrollView={true}
      />
    {/* </TouchableOpacity> */}
    </View>
  )
}
