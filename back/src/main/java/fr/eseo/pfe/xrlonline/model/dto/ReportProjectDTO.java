package fr.eseo.pfe.xrlonline.model.dto;

import lombok.Data;
import org.apache.tomcat.util.codec.binary.Base64;

import java.util.Map;

@Data
public class ReportProjectDTO {

  String lastXrlGraph;
  String lang;
  Map<String, String> linearGraphs;
  String compareWithInitialGraph;
  String compareTwoLastGraphs;
  String completeLinearGraph;

  private byte[] decodeData(String data) {
    if (data == null) return new byte[0];
    String base64Data = data.split(",")[1];
    return Base64.decodeBase64(base64Data);
  }

  public byte[] getLastXrlGraphDecoded() {
    return decodeData(lastXrlGraph);
  }

  public byte[] getLinearGraphDecoded(String key) {
    if (linearGraphs == null) return new byte[0];
    return decodeData(linearGraphs.get(key));
  }

  public byte[] getCompareWithInitialGraphDecoded() {
    return decodeData(compareWithInitialGraph);
  }

  public byte[] getCompareTwoLastGraphsDecoded() {
    return decodeData(compareTwoLastGraphs);
  }

  public byte[] getCompleteLinearGraphDecoded() {
    return decodeData(completeLinearGraph);
  }
}
