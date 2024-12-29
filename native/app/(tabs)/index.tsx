import { Image, StyleSheet, Button, Alert } from 'react-native'
import { HelloWave } from '@/components/HelloWave'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useQuery } from '@tanstack/react-query'
import { createV1HealthQuery } from '@/api/queries'
import ez from '@/api/ez'

export default function HomeScreen() {
  const { data, error, refetch } = useQuery(createV1HealthQuery({}))

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: {error ? 'LoggedOut' : data?.status}</ThemedText>
        <ThemedText>
          <Button
            title={error ? 'Login' : data?.status ? 'Logout' : 'Loading...'}
            disabled={!error && !data?.status}
            onPress={() => {
              if (data?.status && !error) return ez.post.v1Logout().then(() => refetch())
              ez.post
                .v1Login({ email: 'tim@brightsidedeveloper.com', password: 'aaaaaaaa' })
                .then(() => refetch())
                .catch((err) => Alert.alert('Login failed', err.message))
            }}
          />
          {error && (
            <Button
              title="Sign Up"
              onPress={() =>
                ez.post
                  .v1Signup({ email: 'tim@brightsidedeveloper.com', password: 'aaaaaaaa' })
                  .then(() => refetch())
                  .catch((err) => Alert.alert('Login create account', err.message))
              }
            />
          )}
          {!!data?.status && !error && <Button title="Delete Account" onPress={() => ez.post.v1DeleteAccount().then(() => refetch())} />}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>Tap the Explore tab to learn more about what's included in this starter app.</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
})
