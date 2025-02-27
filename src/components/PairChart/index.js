import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import styled from 'styled-components'
import { Area, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, BarChart, Bar } from 'recharts'
import { RowBetween, AutoRow } from '../Row'

import { toK, toNiceDate, toNiceDateYear, formattedNum, getTimeframe } from '../../utils'
import { ChartOptionButton, SelectorOptionButton } from '../ButtonStyled'
// import { darken } from 'polished'
import { usePairChartData, useHourlyRateData, usePairData } from '../../contexts/PairData'
import { timeframeOptions } from '../../constants'
import { useMedia } from 'react-use'
import { EmptyCard } from '..'
import DropdownSelect from '../DropdownSelect'
import CandleStickChart from '../CandleChart'
import LocalLoader from '../LocalLoader'
import { useTranslation } from 'react-multi-lang'
// import { useDarkModeManager } from '../../contexts/LocalStorage'

const ChartWrapper = styled.div`
  height: 100%;
  max-height: 470px;
  overflow: hidden;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`

const OptionsRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 40px;
`

const CHART_VIEW = {
  VOLUME: 'Volume',
  LIQUIDITY: 'Liquidity',
  RATE0: 'Rate 0',
  RATE1: 'Rate 1',
}

const PairChart = ({ address, color, base0, base1 }) => {
  const [chartFilter, setChartFilter] = useState(CHART_VIEW.LIQUIDITY)

  const [timeWindow, setTimeWindow] = useState(timeframeOptions.MONTH)

  // const [darkMode] = useDarkModeManager()
  // const textColor = darkMode ? 'white' : 'black'

  // update the width on a window resize
  const ref = useRef()
  const isClient = typeof window === 'object'
  const [width, setWidth] = useState(ref?.current?.container?.clientWidth)
  const [height, setHeight] = useState(ref?.current?.container?.clientHeight)
  useEffect(() => {
    if (!isClient) {
      return false
    }
    function handleResize() {
      setWidth(ref?.current?.container?.clientWidth ?? width)
      setHeight(ref?.current?.container?.clientHeight ?? height)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [height, isClient, width]) // Empty array ensures that effect is only run on mount and unmount

  const t = useTranslation()
  // get data for pair, and rates
  const pairData = usePairData(address)
  let chartData = usePairChartData(address)
  const hourlyData = useHourlyRateData(address, timeWindow)
  const hourlyRate0 = hourlyData && hourlyData[0]
  const hourlyRate1 = hourlyData && hourlyData[1]

  // formatted symbols for overflow
  const formattedSymbol0 =
    pairData?.token0?.symbol.length > 6 ? pairData?.token0?.symbol.slice(0, 5) + '...' : pairData?.token0?.symbol
  const formattedSymbol1 =
    pairData?.token1?.symbol.length > 6 ? pairData?.token1?.symbol.slice(0, 5) + '...' : pairData?.token1?.symbol

  // const below1600 = useMedia('(max-width: 1600px)')
  const below1080 = useMedia('(max-width: 1080px)')
  const below600 = useMedia('(max-width: 600px)')

  /**
   * Used to format values on chart on scroll
   * Needs to be raw html for chart API to parse styles
   * @param {*} val
   */
  const valueFormatter = useCallback(
    (val) => {
      if (chartFilter === CHART_VIEW.RATE0) {
        return (
          formattedNum(val) +
          `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol1}/${formattedSymbol0}<span>`
        )
      }
      if (chartFilter === CHART_VIEW.RATE1) {
        return (
          formattedNum(val) +
          `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol0}/${formattedSymbol1}<span>`
        )
      }
    },
    [chartFilter, formattedSymbol0, formattedSymbol1]
  )

  let utcStartTime = getTimeframe(timeWindow)
  chartData = chartData?.filter((entry) => entry.date >= utcStartTime)

  if (chartData && chartData.length === 0) {
    return (
      <ChartWrapper>
        <EmptyCard height="300px">No historical data yet.</EmptyCard>{' '}
      </ChartWrapper>
    )
  }

  const aspect = 0

  return (
    <ChartWrapper>
      {below600 ? (
        <RowBetween mb={40}>
          <DropdownSelect options={CHART_VIEW} active={chartFilter} setActive={setChartFilter} color={color} />
          <DropdownSelect options={timeframeOptions} active={timeWindow} setActive={setTimeWindow} color={color} />
        </RowBetween>
      ) : (
        <OptionsRow>
          <AutoRow gap="6px" style={{ flexWrap: 'nowrap' }}>
            <SelectorOptionButton
              active={chartFilter === CHART_VIEW.LIQUIDITY}
              onClick={() => {
                setTimeWindow(timeframeOptions.ALL_TIME)
                setChartFilter(CHART_VIEW.LIQUIDITY)
              }}
            >
              {t('liquidity')}
            </SelectorOptionButton>
            <SelectorOptionButton
              active={chartFilter === CHART_VIEW.VOLUME}
              onClick={() => {
                setTimeWindow(timeframeOptions.ALL_TIME)
                setChartFilter(CHART_VIEW.VOLUME)
              }}
            >
              {t('volume')}
            </SelectorOptionButton>
            <SelectorOptionButton
              active={chartFilter === CHART_VIEW.RATE0}
              onClick={() => {
                setTimeWindow(timeframeOptions.WEEK)
                setChartFilter(CHART_VIEW.RATE0)
              }}
            >
              {pairData.token0 ? formattedSymbol1 + '/' + formattedSymbol0 : '-'}
            </SelectorOptionButton>
            <SelectorOptionButton
              active={chartFilter === CHART_VIEW.RATE1}
              onClick={() => {
                setTimeWindow(timeframeOptions.WEEK)
                setChartFilter(CHART_VIEW.RATE1)
              }}
            >
              {pairData.token0 ? formattedSymbol0 + '/' + formattedSymbol1 : '-'}
            </SelectorOptionButton>
          </AutoRow>
          <AutoRow justify="flex-end" gap="6px">
            <ChartOptionButton
              active={timeWindow === timeframeOptions.WEEK}
              onClick={() => setTimeWindow(timeframeOptions.WEEK)}
              style={{ marginRight: '4px' }}
            >
              {t('time.1week')}
            </ChartOptionButton>
            <ChartOptionButton
              active={timeWindow === timeframeOptions.MONTH}
              onClick={() => setTimeWindow(timeframeOptions.MONTH)}
              style={{ marginRight: '4px' }}
            >
              {t('time.1month')}
            </ChartOptionButton>
            <ChartOptionButton
              active={timeWindow === timeframeOptions.ALL_TIME}
              onClick={() => setTimeWindow(timeframeOptions.ALL_TIME)}
            >
              {t('all')}
            </ChartOptionButton>
          </AutoRow>
        </OptionsRow>
      )}
      {chartFilter === CHART_VIEW.LIQUIDITY && (
        <ResponsiveContainer aspect={aspect}>
          <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={chartData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={14}
              minTickGap={80}
              tickFormatter={(tick) => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
              type={'number'}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              type="number"
              orientation="right"
              tickFormatter={(tick) => '$' + toK(tick)}
              axisLine={false}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={0}
              tickMargin={16}
              tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
            />
            <Tooltip
              cursor={true}
              formatter={(val) => formattedNum(val, true)}
              labelFormatter={(label) => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '10px 14px',
                borderRadius: 6,
                borderColor: 'transparent',
                background: '#353535',
                color: 'white',
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            <Area
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={' (USD)'}
              dataKey={'reserveUSD'}
              yAxisId={0}
              stroke={'#009CE1'}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {chartFilter === CHART_VIEW.RATE1 &&
        (hourlyRate1 ? (
          <ResponsiveContainer aspect={aspect} ref={ref}>
            <CandleStickChart
              data={hourlyRate1}
              base={base0}
              margin={false}
              width={width}
              valueFormatter={valueFormatter}
            />
          </ResponsiveContainer>
        ) : (
          <LocalLoader />
        ))}

      {chartFilter === CHART_VIEW.RATE0 &&
        (hourlyRate0 ? (
          <ResponsiveContainer aspect={aspect} ref={ref}>
            <CandleStickChart
              data={hourlyRate0}
              base={base1}
              margin={false}
              width={width}
              valueFormatter={valueFormatter}
            />
          </ResponsiveContainer>
        ) : (
          <LocalLoader />
        ))}

      {chartFilter === CHART_VIEW.VOLUME && (
        <ResponsiveContainer aspect={aspect}>
          <BarChart
            margin={{ top: 0, right: 0, bottom: 6, left: below1080 ? 0 : 10 }}
            barCategoryGap={1}
            data={chartData}
          >
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              minTickGap={80}
              tickMargin={14}
              tickFormatter={(tick) => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
              type={'number'}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              type="number"
              axisLine={false}
              tickMargin={16}
              tickFormatter={(tick) => '$' + toK(tick)}
              tickLine={false}
              interval="preserveEnd"
              orientation="right"
              minTickGap={80}
              yAxisId={0}
              tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
            />
            <Tooltip
              cursor={{ fill: color, opacity: 0.1 }}
              formatter={(val) => formattedNum(val, true)}
              labelFormatter={(label) => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '10px 14px',
                borderRadius: 6,
                borderColor: 'transparent',
                background: '#353535',
                color: 'white',
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            <Bar
              type="monotone"
              name={'Volume'}
              dataKey={'dailyVolumeUSD'}
              fill={'#009CE1'}
              yAxisId={0}
              stroke={'#009CE1'}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartWrapper>
  )
}

export default memo(PairChart)
