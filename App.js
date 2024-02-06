import { useEffect, useState } from "react";
import { useCameraPermissions, CameraView } from "expo-camera/next";
import { Button, StyleSheet, Text, View } from "react-native";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (permission?.status === null)
    return (
      <View>
        <Text>Getting camera permission...</Text>
      </View>
    );

  if (permission?.status === false)
    return (
      <View>
        <Text>Don't have camera permission :(</Text>
      </View>
    );

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barCodeTypes: ["ean13"],
          isGuidanceEnabled: true,
          isHighlightingEnabled: true,
          isPinchToZoomEnabled: true,
        }}
        onBarcodeScanned={scanned ? undefined : setScanned}
      ></CameraView>
      {scanned && (
        <View style={styles.scanned}>
          <Text>Scanned Type: {scanned?.type ?? "N/A"}</Text>
          <Button
            disabled={!scanned}
            title="Scan Again"
            onPress={() => setScanned(false)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  scanned: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: 20,
  },
});
