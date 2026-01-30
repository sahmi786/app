import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, utcToZonedTime } from 'date-fns-tz';
import { colors, defaultClocks } from '../lib/theme';

const WorldClocks = ({ clocks = defaultClocks, compact = false }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeInZone = (timezone) => {
    try {
      const zonedTime = utcToZonedTime(time, timezone);
      return format(zonedTime, 'HH:mm');
    } catch (error) {
      return '--:--';
    }
  };

  return (
    <View style={styles.container}>
      {clocks.map((clock) => (
        <View key={clock.id} style={[styles.clock, compact && styles.clockCompact]}>
          <Text style={[styles.time, compact && styles.timeCompact]}>
            {getTimeInZone(clock.timezone)}
          </Text>
          <Text style={[styles.city, compact && styles.cityCompact]}>
            {clock.city}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clock: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
  },
  clockCompact: {
    padding: 8,
  },
  time: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  timeCompact: {
    fontSize: 16,
  },
  city: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 4,
  },
  cityCompact: {
    fontSize: 9,
  },
});

export default WorldClocks;
