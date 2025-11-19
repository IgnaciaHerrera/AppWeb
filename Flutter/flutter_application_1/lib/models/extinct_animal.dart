// lib/models/extinct_animal.dart

class ExtinctAnimal {
  final String commonName;
  final String binomialName;
  final String location;
  final String lastRecord;
  final String wikiLink;
  final String shortDesc;
  final String imageSrc;

  ExtinctAnimal({
    required this.commonName,
    required this.binomialName,
    required this.location,
    required this.lastRecord,
    required this.wikiLink,
    required this.shortDesc,
    required this.imageSrc,
  });

  factory ExtinctAnimal.fromJson(Map<String, dynamic> json) {
    return ExtinctAnimal(
      commonName: json['commonName'] ?? 'Unknown',
      binomialName: json['binomialName'] ?? 'Unknown',
      location: json['location'] ?? 'Unknown location',
      lastRecord: json['lastRecord']?.toString() ?? 'N/A',
      wikiLink: json['wikiLink'] ?? '',
      shortDesc: json['shortDesc'] ?? 'No description available.',
      imageSrc: json['imageSrc'] ?? '',
    );
  }
}
