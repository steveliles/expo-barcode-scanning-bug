import { useEffect, useState } from "react";
import { useCameraPermissions, CameraView } from "expo-camera/next";
import { Button, StyleSheet, Text, View } from "react-native";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (scanned?.data) {
      console.log(JSON.stringify(scanned, null, 2));

      const data = scanned.data;
      const data_cleaned = removeInvisibleChars(data);

      console.log({
        data,
        length: data.length,
        first: data.slice(0, 1),
      });

      console.log({
        data_cleaned,
        length: data_cleaned.length,
        first: data_cleaned.slice(0, 1),
      });
    }
  }, [scanned]);

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (permission?.status === null)
    return (
      <View>
        <Text>Getting camera permission...</Text>
      </View>
    );

  if (permission?.granted === false)
    return (
      <View>
        <Text>Don't have camera permission</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barCodeTypes: ["datamatrix"],
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

function removeInvisibleChars(data) {
  return data.replace(/\u001D/g, "");
}
